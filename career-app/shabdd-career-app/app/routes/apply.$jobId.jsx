import { ObjectId } from "mongodb";
import { data, useLoaderData } from "react-router";
import ApplicationForm from "../components/applications/ApplicationForm";
import { createApplication, getPublishedJobById } from "../models/application.server";

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

export const loader = async ({ params }) => {
  const job = await getPublishedJobById(params.jobId || "");

  if (!job) {
    throw new Response("Job not found", { status: 404 });
  }

  return {
    job: serializeJob(job),
  };
};

export const action = async ({ request, params }) => {
  const job = await getPublishedJobById(params.jobId || "");

  if (!job) {
    return data({ error: "This job is no longer accepting applications." }, { status: 404 });
  }

  const formData = await request.formData();
  const missingField = requiredFields.find((fieldName) => !getText(formData, fieldName));

  if (missingField) {
    return data({ error: "Please complete all required fields." }, { status: 400 });
  }

  const expectedSalary = Number(getText(formData, "expectedSalary"));

  if (!Number.isFinite(expectedSalary) || expectedSalary < 0) {
    return data({ error: "Please enter a valid expected salary." }, { status: 400 });
  }

  const email = getText(formData, "email");

  if (!email.includes("@")) {
    return data({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const availableStart = new Date(getText(formData, "availableStart"));

  if (Number.isNaN(availableStart.getTime())) {
    return data({ error: "Please enter a valid available start date." }, { status: 400 });
  }

  const dateOfBirthValue = getText(formData, "dateOfBirth");
  const dateOfBirth = dateOfBirthValue ? new Date(dateOfBirthValue) : null;

  if (dateOfBirthValue && Number.isNaN(dateOfBirth.getTime())) {
    return data({ error: "Please enter a valid date of birth." }, { status: 400 });
  }

  await createApplication({
    shopId: job.shopId,
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

  return { success: true };
};

export default function ApplyForJob() {
  const { job } = useLoaderData();

  return <ApplicationForm job={job} />;
}

function getText(formData, fieldName) {
  return String(formData.get(fieldName) || "").trim();
}

function serializeJob(job) {
  return {
    id: job._id.toString(),
    jobTitle: job.jobTitle || "Untitled Job",
    department: job.department || "Not provided",
    employmentType: job.employmentType || "Not provided",
    shiftSchedule: job.shiftSchedule || "Not provided",
    location: job.location || "Not provided",
  };
}
