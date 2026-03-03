```sh

function p
    # Get the path of the tool(it may differ based on your setup)
    set TOOL_PATH /home/mohannad/Programming/personal/project-manager/index.ts
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
