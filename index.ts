import { $ } from "bun";

interface Project {
  name?: string;
  path?: string;
}
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
  Bun.write(FILE_PATH, JSON.stringify(projects));
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
    console.log(targetPath)

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

function addProject(projects: Array<Project>, projectName: string | undefined) {
  projects.push({ name: projectName, path: getCurrentDirectory() });
  writeProjects(projects);
}
function listProjects(projects:Project[]){
    projects.forEach((project: Project)=> console.log(project) )
}

async function main() {
  let projects = await readFromJson(FILE_PATH);
  // console.log(projects)
  const args = Bun.argv.slice(2);
  // console.log(args)
  if (args.includes("--add")) {
    const projectName = args[args.indexOf("--add") + 1];
    if (projectName !== undefined) {
      addProject(projects, projectName);
      return;
    } else {
      console.error("Please provide a project name");
    }
  } else {
    goToProject(args[0], projects);
    // console.log(getCurrentDirectory());
    // console.log(args[0]);
  }
}

main();

