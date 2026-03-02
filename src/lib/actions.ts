"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function getCampaigns() {
  try {
    return await prisma.campaign.findMany({
      include: { metrics: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export async function createCampaign(formData: FormData) {
  const name = formData.get("name") as string;
  const channel = formData.get("channel") as string;
  const budget = parseFloat(formData.get("budget") as string);
  const socialLink = formData.get("socialLink") as string;

  try {
    await prisma.campaign.create({
      data: {
        name,
        channel,
        budget,
        socialLink,
        impressions: Math.floor(Math.random() * 10000) + 1000,
        status: "active",
      },
    });
    // Multi-path revalidation for global report sync
    revalidatePath("/dashboard");
    revalidatePath("/campaigns");
    revalidatePath("/audience");
    revalidatePath("/channels");
    revalidatePath("/reports");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}



export async function deleteCampaign(id: string) {
  try {
    await prisma.campaign.delete({
      where: { id },
    });
    revalidatePath("/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
  }
}

export async function updateCampaignStatus(id: string, status: string) {
  try {
    await prisma.campaign.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/campaigns");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update campaign status:", error);
    return { success: false };
  }
}

export async function getAudienceInsights() {
  try {
    const metrics = await prisma.audienceMetric.findMany();
    
    // Group by type and label for charts
    const age = metrics.filter((m: any) => m.type === "age")
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find((a: any) => a.name === curr.label);
        if (existing) existing.value += curr.value;
        else acc.push({ name: curr.label, value: curr.value });
        return acc;
      }, []);

    const gender = metrics.filter((m: any) => m.type === "gender")
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find((a: any) => a.name === curr.label);
        if (existing) existing.value += curr.value;
        else acc.push({ name: curr.label, value: curr.value });
        return acc;
      }, []);

    const location = metrics.filter((m: any) => m.type === "location")
      .reduce((acc: any[], curr: any) => {
        const existing = acc.find((a: any) => a.name === curr.label);
        if (existing) existing.value += curr.value;
        else acc.push({ name: curr.label, value: curr.value });
        return acc;
      }, []);

    return { age, gender, location };
  } catch (error) {
    console.error("Failed to fetch audience insights:", error);
    return { age: [], gender: [], location: [] };
  }
}

export async function getReports() {
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return [];
  }
}

export async function createReport(name: string, type: string, data: any) {
  try {
    const reportData = JSON.stringify(data);
    const size = `${(reportData.length / 1024).toFixed(1)} KB`;
    
    await prisma.report.create({
      data: {
        name,
        type,
        size,
        data: reportData,
        status: "ready",
      },
    });
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    console.error("Failed to create report:", error);
    return { success: false, error: "Failed to create report" };
  }
}

export async function deleteReport(id: string) {
  try {
    await prisma.report.delete({
      where: { id },
    });
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete report:", error);
    return { success: false, error: "Failed to delete report" };
  }
}

export async function getUserProfile(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        region: true,
        emailWeekly: true,
        budgetAlerts: true,
        monthlyReports: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false };
  }
}

export async function updateNotifications(userId: string, data: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return { success: false };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false };
  }
}

// Competitor Actions
export async function getCompetitors() {
  try {
    return await prisma.competitor.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch competitors:", error);
    return [];
  }
}

export async function addCompetitor(data: { name: string; website: string; strategy: string; traffic: string; notes: string }) {
  try {
    await prisma.competitor.create({
      data,
    });
    revalidatePath("/competitors");
    return { success: true };
  } catch (error) {
    console.error("Failed to add competitor:", error);
    return { success: false };
  }
}

export async function deleteCompetitor(id: string) {
  try {
    await prisma.competitor.delete({
      where: { id },
    });
    revalidatePath("/competitors");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete competitor:", error);
    return { success: false };
  }
}


