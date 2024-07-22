import * as github from "@pulumi/github";

export const kdhCodesRepo = new github.Repository(
    "kdh-codes-repository",
    {
        description: "How I deploy my overengineered CV",
        hasDownloads: true,
        hasIssues: true,
        hasProjects: true,
        name: "kdh.codes",
        visibility: "private",
    },
    {
        protect: true,
    },
);

const kdhCodesDefaultBranch = new github.BranchDefault(
    "kdh-codes-repository-default-branch",
    {
        branch: "main",
        repository: kdhCodesRepo.id,
    },
);
