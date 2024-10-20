import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";
import Board from "@/components/Board";


const page = async () => {
  const { userId } = auth();

  const board = await prisma.kanbanBoard.findFirst({
    where: {
      userId: userId!,
    },
    include: {
      tasks: true,
    },
  });
  return (
    <>
      <Board board={board} />
    </>
    
  )
}

export default page;
