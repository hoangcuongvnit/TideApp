# TideApp-ts

## Multiple environments build

### Proof of concept:
- By default you only can set `.env` at build time.

- With this concept, you can change your env build at run time environment by `VITE_ENV`.

- To do that, we need to pre-define to build all artifact of all environment and start by choosing which to run.

### Steps to build

- Give 2 env file: `.env.development` and `.env.production`

- `Dockerfile` build all the artifacts of 2 env and copy it to directory `/usr/share/env`

- When start the container, we use RUN TIME environment to choose the build with 2 options:
    +  `VITE_ENV` = `dev`
    +  `VITE_ENV` = `prod`

- Check script `env.sh` for more detail.

- We can define more environment example `staging` in `Dockerfile`. 
