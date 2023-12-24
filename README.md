# @mintplayer/nx-plugins
Collection of plugins (generators and executors) for NX

## create-probot-app
When starting from scratch, you'd normally use

    npx create-probot-app

to generate a new Probot app. However, you can't combine multiple Probot apps into a monorepo. Neither are you able to share code between apps using typescript libraries. This repository contains a generator and builder to integrate with NX.

    npx create-nx-workspace
    cd xxx
    npm i -D @mintplayer/nx-generators
    nx generate @mintplayer/nx-generators:create-probot-app