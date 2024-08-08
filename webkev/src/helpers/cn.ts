export const cn = (...args: (string | undefined)[]) => {
    return args.filter((v) => !!v).join(" ");
};

export const optional = (flag: boolean, className: string) =>
    flag ? className : undefined;
