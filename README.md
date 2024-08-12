# kdh.codes

Howdy, this is the repo that holds all the code for my personal website, [kdh.codes](https://kdh.codes).
It's under construction and is really just a platform for me to mess around with stuff, so it's not the most amazingly well engineered thing.

It's a monorepo, but without all the cool bells and whistles like shared deps. There's not any shared code between the two modules, but hey that could change at some point

Is it a good idea to make this repo public? Probably not. But I'm hoping security through obscurity saves me from any potential problems.

## webkev
This is the [Preact](https://preactjs.com) frontend, nothing special really, all the fun stuff happens when we deploy it.

It uses [Bun](https://bun.sh) runtime/dep manager for funsies and [Vite](https://vitejs.dev/guide/) to build.

## kevfrastructure

A few things lumped into one module, but mostly [Pulumi](https://www.pulumi.com) IAC to build, deploy and host Webkev and a lambda to handle the contact form submissions.
