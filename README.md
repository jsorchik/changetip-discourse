changetip-discourse
======================

A [Discourse](http://discourse.org) plugin to embed a [ChangeTip tip.me](https://www.changetip.com/tipme) button into each post.

Installation
============

* Run `rake plugin:install repo=http://github.com/jsorchik/changetip-discourse` in your discourse directory
* In development mode, run `rake assets:clean`
* In production, recompile your assets: `rake assets:precompile`

Configuration
=============

1. Add 'tip' as the first entry under `Admin > Settings > Basic Setup > post menu`.
2. Add a custom field named `ChangeTip Username` under `Admin > Customize > User Fields`. Set it to be a Text Field and to be editable after signup.
3. Have your users set the `ChangeTip Username` parameter in their Discourse user preferences to their ChangeTip username. For example if their tip page address is `http://joshcoinbase.tip.me`,  enter `joshcoinbase`.
4. Profit.
