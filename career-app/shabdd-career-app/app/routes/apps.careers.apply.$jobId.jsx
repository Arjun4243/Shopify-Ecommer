import { ObjectId } from "mongodb";
import {
  createApplication,
  getPublishedJobByIdForShop,
} from "../models/application.server";
import { authenticate } from "../shopify.server";

const maxResumeSize = 5 * 1024 * 1024;
const requiredFields = [
  "fullName",
  "email",
  "phone",
  "experience",
  "qualification",
  "availableStart",
  "expectedSalary",
  "skills",
  "consent",
];

export const action = async ({ request, params }) => {
  const context = await authenticate.public.appProxy(request);
  const shopId = context.session?.shop || new URL(request.url).searchParams.get("shop");
  const job = await getPublishedJobByIdForShop(params.jobId || "", shopId);

  if (!job) {
    return jsonResponse(
      { error: "This job is no longer accepting applications." },
      404,
    );
  }

  const formData = await request.formData();
  const missingField = requiredFields.find((fieldName) => !getText(formData, fieldName));

  if (missingField) {
    return jsonResponse({ error: "Please complete all required fields." }, 400);
  }

  const expectedSalary = Number(getText(formData, "expectedSalary"));

  if (!Number.isFinite(expectedSalary) || expectedSalary < 0) {
    return jsonResponse({ error: "Please enter a valid expected salary." }, 400);
  }

  const email = getText(formData, "email");

  if (!email.includes("@")) {
    return jsonResponse({ error: "Please enter a valid email address." }, 400);
  }

  const availableStart = new Date(getText(formData, "availableStart"));

  if (Number.isNaN(availableStart.getTime())) {
    return jsonResponse(
      { error: "Please enter a valid available start date." },
      400,
    );
  }

  const dateOfBirthValue = getText(formData, "dateOfBirth");
  const dateOfBirth = dateOfBirthValue ? new Date(dateOfBirthValue) : null;

  if (dateOfBirthValue && Number.isNaN(dateOfBirth.getTime())) {
    return jsonResponse({ error: "Please enter a valid date of birth." }, 400);
  }

  const resume = formData.get("resume");

  if (resume && typeof resume === "object" && "size" in resume && resume.size > 0) {
    if (resume.size > maxResumeSize) {
      return jsonResponse(
        { error: "Resume exceeds the 5 MB file size limit." },
        400,
      );
    }

    if (resume.type && resume.type !== "application/pdf") {
      return jsonResponse({ error: "Resume must be a PDF file." }, 400);
    }
  }

  const applicationId = await createApplication({
    shopId,
    jobId: new ObjectId(job._id),
    fullName: getText(formData, "fullName"),
    email,
    phone: getText(formData, "phone"),
    dateOfBirth,
    currentCity: getText(formData, "currentCity"),
    linkedin: getText(formData, "linkedin"),
    experience: getText(formData, "experience"),
    qualification: getText(formData, "qualification"),
    currentJobTitle: getText(formData, "currentJobTitle"),
    currentCompany: getText(formData, "currentCompany"),
    availableStart,
    noticePeriod: getText(formData, "noticePeriod"),
    expectedSalary,
    salaryType: getText(formData, "salaryType") || "Per Month",
    skills: getText(formData, "skills")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    coverLetter: getText(formData, "coverLetter"),
  });

  return jsonResponse({
    success: true,
    applicationId: applicationId.toString(),
  });
};

function getText(formData, fieldName) {
  return String(formData.get(fieldName) || "").trim();
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
