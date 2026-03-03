interface Project {
  name?: string;
  path?: string;
}
interface Flag {
  flag: string;
  command: Function;
}

const ArgumentFlags: Flag[] = [
  { flag: "--add", command: addProject },
  { flag: "--remove", command: removeProject },

];
const NonArguementFlags: Flag[] = [{ flag: "--list", command: listProjects }];

const APP_DIRECTORY = import.meta.dir;
// const FILE_DIRECTORY = import.meta.path;
const FILE_PATH = APP_DIRECTORY + "/projects.json";

// console.log('APP_DIRECTORY : ',APP_DIRECTORY )
// console.log('FILE_DIRECTORY: ',FILE_DIRECTORY)

async function readFromJson(path: string): Promise<Array<Project>> {
  try {
    const file = Bun.file(path);

    return await file.json();
  } catch (e) {
    console.log(e);
    return createFile();
  }
}

async function createFile(): Promise<Project[]> {
  const emptyArray: Project[] = [];
  writeProjects(emptyArray);
  return emptyArray;
}

function getCurrentDirectory() {
  return process.cwd();
}
function writeProjects(projects: Project[]) {
  Bun.write(FILE_PATH, JSON.stringify(projects, null, 2));
}

async function goToProject(
  projectName: string | undefined,
  projects: Project[],
) {
  const targetPath = projects.find(
    (project) => project.name === projectName,
  )?.path;
  if (targetPath === undefined) {
    console.error("Project not found");
    return;
  }
  // Doen't work
  // process.chdir(targetPath);

  // Workaround that also doesn't work
  // console.log(targetPath);
  // await $`cd ${targetPath} && ls`;

  // This method just outputs the path so the shell function can use it instead of running it in the app
  console.log(targetPath);
}

function removeProject(projectName: string | undefined, projects: Project[]) {
  if (projectName === undefined) {
    console.error("Please provide a project name");
    return;
  }
  const targetPath = projects.find(
    (project) => project.name === projectName,
  )?.path;
  if (targetPath === undefined) {
    console.error("Project not found");
    return;
  }
  projects = projects.filter((project) => project.name !== projectName);
  writeProjects(projects);
}

function addProject(projectName: string | undefined, projects: Array<Project>) {
  projects.push({ name: projectName, path: getCurrentDirectory() });
  writeProjects(projects);
}
function listProjects(projects: Project[]) {
  let count = 1
  projects.forEach((project: Project) =>{
  console.log(`${count}: ${project.name} -> path: ${project.path}`);
  count++
  });
  if (count === 1) {
    console.log("No projects found");
  }
}

function ProcessArguementsFlags(projects: Project[], args: string[]) {
  let commandExecuted = false;
  ArgumentFlags.forEach((flag) => {
    if (commandExecuted) {
      return;
    }
    if (args.includes(flag.flag)) {
      const projectName = args[args.indexOf(flag.flag) + 1];
      if (projectName === undefined) {
        console.error("Please provide a project name");
        return;
      }
      flag.command(projectName, projects);
      commandExecuted = true;
    }
  });
  return commandExecuted;
}
function ProcessNonArguementsFlags(projects: Project[], args: string[]) {
  let commandExecuted = false;
  NonArguementFlags.forEach((flag) => {
    if (commandExecuted) {
      return;
    }
    if (args.includes(flag.flag)) {
      flag.command(projects);
      commandExecuted = true;
    }
  });
  return commandExecuted;
}

async function main() {
  let projects = await readFromJson(FILE_PATH);
  const args = Bun.argv.slice(2);
  const hasExecuted =
    ProcessArguementsFlags(projects, args) ||
    ProcessNonArguementsFlags(projects, args);
  if (!hasExecuted) {
    goToProject(args[0], projects);
  }
}

main();
