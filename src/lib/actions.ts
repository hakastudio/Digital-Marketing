"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCampaigns() {
  try {
    return await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        metrics: true,
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

export async function createCampaign(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const channel = formData.get("channel") as string;
    const socialLink = formData.get("socialLink") as string;
    const budget = parseFloat(formData.get("budget") as string);

    const campaign = await prisma.campaign.create({
      data: {
        name,
        channel,
        socialLink,
        budget,
        status: "active",
      },
    });

    revalidatePath("/campaigns");
    revalidatePath("/dashboard");
    revalidatePath("/audience");
    revalidatePath("/funnel");
    revalidatePath("/channels");
    
    return campaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw new Error("Failed to create campaign");
  }
}

export async function deleteCampaign(id: string) {
  try {
    await prisma.campaign.delete({
      where: { id },
    });

    revalidatePath("/campaigns");
    revalidatePath("/dashboard");
    revalidatePath("/audience");
    revalidatePath("/funnel");
    revalidatePath("/channels");
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw new Error("Failed to delete campaign");
  }
}

export async function updateCampaignStatus(id: string, status: string) {
  try {
    await prisma.campaign.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/campaigns");
  } catch (error) {
    console.error("Error updating campaign status:", error);
    throw new Error("Failed to update status");
  }
}

export async function getReports() {
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function createReport(name: string, type: string, data: any) {
  try {
    const reportData = JSON.stringify(data);
    const size = `${(reportData.length / 1024).toFixed(2)} KB`;

    const report = await prisma.report.create({
      data: {
        name,
        type,
        data: reportData,
        size,
        status: "ready",
      },
    });

    revalidatePath("/reports");
    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to create report");
  }
}

export async function deleteReport(id: string) {
  try {
    await prisma.report.delete({
      where: { id },
    });

    revalidatePath("/reports");
  } catch (error) {
    console.error("Error deleting report:", error);
    throw new Error("Failed to delete report");
  }
}

export async function getCompetitors() {
  try {
    return await prisma.competitor.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return [];
  }
}

export async function addCompetitor(data: { name: string; website: string; strategy: string; traffic: string; notes: string }) {
  try {
    const competitor = await prisma.competitor.create({
      data,
    });
    revalidatePath("/competitors");
    return competitor;
  } catch (error) {
    console.error("Error adding competitor:", error);
    throw new Error("Failed to add competitor");
  }
}

export async function deleteCompetitor(id: string) {
  try {
    await prisma.competitor.delete({
      where: { id },
    });
    revalidatePath("/competitors");
    return true;
  } catch (error) {
    console.error("Error deleting competitor:", error);
    throw new Error("Failed to delete competitor");
  }
}

export async function getUserProfile(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(id: string, data: { name: string; companyName: string; region: string }) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath("/settings");
    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function updateNotifications(id: string, data: Record<string, boolean>) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath("/settings");
    return user;
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw new Error("Failed to update notifications");
  }
}

export async function deleteUserAccount(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw new Error("Failed to delete account");
  }
}
