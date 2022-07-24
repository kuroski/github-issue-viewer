// import cli from "next/dist/cli/next-build"
import path from "path"

async function globalSetup() {
  console.log('---- BUILDING')
  // await cli.nextBuild([path.join(__dirname, "..")]);
  console.log('---- BUILDED!')
}

export default globalSetup;
