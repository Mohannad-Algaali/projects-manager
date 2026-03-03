# project-manager

This is a simple project manager, it helps you navigate your projects blazingly fast. 

## Installation

1. clone the repository:

```bash
git clone https://github.com/Mohannad-Algaali/projects-manager.git
```


2. install dependencies:

```bash
cd projects-manager
bun install
```

3. add the following function to your ~/.config/fish/config.fish:

```bash
function p
    # Get the path of the tool(it may differ based on your setup)
    set TOOL_PATH /path/to/app/index.ts # YOU HAVE TO CHANGE THIS TO WHERE YOU SAVED THE APP
    # If using a flag, run directly without capturing output
    if string match -q -- '--*' $argv[1]
      # bun /home/mohannad/Programming/personal/project-manager/index.ts $argv
      bun $TOOL_PATH $argv
    else
      # For project navigation, capture output and cd
      set target (bun $TOOL_PATH $argv)
      if test -d "$target"
        cd "$target"
      else
        echo $target
      end
    end
  end
```

or if you are using zsh or bash, paste the following to your ~/.bashrc or ~/.zshrc:

```bash
p() {
    # In Bash, we assign variables directly without the 'set' keyword
    local TOOL_PATH="/path/to/app/index.ts"

    if [[ "$1" == --* ]]; then
        bun "$TOOL_PATH" "$@"
    else
        local target
        target=$(bun "$TOOL_PATH" "$@")

        if [[ -d "$target" ]]; then
            cd "$target" || return
        else
            echo "$target"
        fi
    fi
}
```

4. source the config file:

```bash
source ~/.config/fish/config.fish # for fish
source ~/.bashrc # for bash
source ~/.zshrc # for zsh
```

### Usage

You can use the following commands:
```bash
p --list # list all projects
p --add <project_name> # add a new project at current directory
p --remove <project_name> # remove a project
```

This project was made by [Mohannad Algaali](https://github.com/Mohannad-Algaali)
