import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT

async function main() {
  try {
    await prisma.$connect();
    console.log("Prisma is successfully connect");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("an Error", error);
    await prisma.$disconnect(),
    process.exit(1)
  }
}

main();