> Kwai-ui is superseded by [kwai-vite](https://github.com/fbraem/kwai-vite). Kwai-vite builds
> on the experencies we have learned here, but uses [vite](https://vitejs.dev/) instead of webpack.

Kwai-ui
=======
Kwai-ui is a part of the kwai system. The ultimate goal of Kwai is to manage 
a (sports)club. The focus is currently on judo sport (Kwai means club in
Japanese), but in the future it may be possible to support other sports.

The backend (api) of kwai can be found in the
[kwai-api](https://github.com/fbraem/kwai-api) repository.

> Kwai is a greenfield project. As long as there is no official release,
> everything can change. Although there is still a lot to do, kwai is already used in production for
> our club but that is no guarantee that it will work for you...

UI
==
Kwai UI is a Single Page Application (SPA) written with
[vue](https://vuejs.org/) and [tailwindcss](https://tailwindcss.com/) 
as the main components.

Currently, the following is available:

- news
- pages
- members
- teams
- trainings

TODO
====

There is still a lot to do:

- tournament management
- member follow-up system
- events
- Separate club specific information
- ...

Installation
============

Clone this repository. Copy the kwai.dist.js file to kwai.production.js or
kwai.development.js and change the configurations.

Make sure package manager [npm](https://www.npmjs.com/) is installed and run 
the following commands in the directory where you cloned the repository:

    npm install

To create a build (production build) run:
    
    npm run build
    
To create a development version run:

    npm run dev

The result is a build directory. Copy this directory with all its contents to
your webserver.

vagrant
=======

Vagrant can be used to set up a test environment. Before start, use 
`kwai.development.yaml` to configure the location of the folder of the 
custom HTML and images. For example:

```yaml
---
custom: '/development/code/kwai-custom'
```

This vagrant box contains only the client code. Make sure kwai-api is also
available (and configure CORS).

When the box is up and running, use `vagrant ssh KWAI_UI` to enter the server.
Change the current folder to `/vagrant` and run `npm run dev` to build the
client application.

Customize
=========
In several places it is possible to add custom HTML. Each application can be
customized. Create a folder and make sure the configuration file contains
the `custom` property.

+ `footer.html` will be loaded as footer on each page.

portal
------
Portal is the home page.

+ `/portal/header.html` will be loaded between the toolbar and the overview of the application. 
+ `/portal/about.html` will be added to the bottom of the portal page.

Credits
=======
+ [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984393) for free images.
+ [Font Awesome](https://fontawesome.com/) for free icons.
