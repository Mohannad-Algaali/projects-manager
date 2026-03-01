interface Project{
    name?: string
    path?: string
}

const FILE_NAME = 'projects.json'



async function readFromJson (path : string): Promise<Array<Project>> {

    try{
        const file = Bun.file(path);
        return await file.json();
    }
    catch(e){
        console.log(e)
        return createFile(path) 
    }
}

async function createFile(path: string): Promise<Project[]>{
    const emptyArray : Project[] = []
    await Bun.write( path, JSON.stringify(emptyArray));
    return emptyArray
}


async function main(){
    let projects = await readFromJson(FILE_NAME)
    console.log(projects)
    const args = Bun.argv.slice(2)
    console.log(args)
    if(args.includes('--add')){
        const projectName = args[args.indexOf('--add') + 1] || 'project'+ Date.now()
        addProject(projects, projectName)
    }
}
function getCurrentDirectory(){
    return process.cwd()
}

function addProject(projects:Array<Project>, projectName: string ){
    projects.push({name: projectName, path: getCurrentDirectory()})

    console.log(projects)
}
main()
