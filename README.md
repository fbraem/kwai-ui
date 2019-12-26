Kwai-ui
=======

Kwai-ui is a part of the kwai system. The ultimate goal of Kwai is to manage a (sports)club. The focus is currently on judo sport (Kwai means club in Japanese), but in the future it may be possible to support
other sports.

The backend (api) of kwai can be found in the [kwai-api](https://github.com/fbraem/kwai-api) repository.

UI
==
Kwai UI is a Single Page Application (SPA) written with [vue](https://vuejs.org/) and [tailwindcss](https://tailwindcss.com/) as the main components.

Currently the following is available:

- news
- pages
- members
- teams
- trainings

Although there is still a lot to do, kwai is already used in production for our club.

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

Clone this repository. Change the configuration in `site/config/production.js`.

Make sure package manager [npm](https://www.npmjs.com/) is installed and run the following commands in the directory where you cloned the repository:

    npm install
    npm run build

The result is a build directory. Copy this directory with all its contents to your host.

Credits
=======
+ [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984393) for free images.
