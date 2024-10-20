"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createNewBoard(formData: FormData) {
    const { userId } = auth();  // Kullanıcı kimliği buradan alınıyor
    const name = formData.get("boardname") as string;

    if (!userId) {
        throw new Error("Kullanıcı doğrulanamadı.");
    }

    // Mevcut kullanıcıya ait bir board olup olmadığını kontrol et
    const existingBoard = await prisma.kanbanBoard.findFirst({
        where: {
            userId: userId,
        },
    });

    if (existingBoard) {
        // Eğer board varsa, ismini güncelle
        await prisma.kanbanBoard.update({
            where: {
                id: existingBoard.id,
            },
            data: {
                name: name,
            },
        });
    } else {
        // Eğer board yoksa, yeni board oluştur
        await prisma.kanbanBoard.create({
            data: {
                name: name,
                userId: userId,
            },
        });
    }

    revalidatePath("/mykanban");
}

export async function createTask(formData: FormData) {
    const { userId } = auth();
    const name = formData.get("task") as string;
    const boardId = formData.get("boardId") as string;

    if (!name.trim()) {
        return;
    }

    if (!userId) {
        throw new Error("Kullanıcı doğrulanamadı.");
    }

    // Görevi yarat ve ilgili board'a bağla
    await prisma.task.create({
        data: {
            name: name,
            board: { connect: { id: boardId } },
            status: "TODO",
        },
    });

    revalidatePath("/");
}

export async function editTask(formData: FormData) {
    const newTask = formData.get("newTask") as string;
    const taskId = formData.get("taskId") as string;

    if (!newTask.trim()) {
        return;
    }

    await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            name: newTask,
        },
    });

    revalidatePath("/")
}

export async function deleteTask(formData: FormData) {
    const taskId = formData.get("taskId") as string;
  
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  
    revalidatePath("/");
  }