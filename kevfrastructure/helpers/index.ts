import { execSync } from "child_process";

export const exec = (command: string, cwd: string) => {
    return execSync(command, {
        cwd,
        env: process.env,
    })
        .toString()
        .trim();
};
