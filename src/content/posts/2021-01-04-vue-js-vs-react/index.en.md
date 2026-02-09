---
title: Vue.JS vs React
date: 2022-01-23
featuredImage: /photos/vue-vs-react.jpg
description: A comparison between two of the most widely used frontend technologies in recent years
tags:
  - React
  - Development
  - Tecnología
  - Javascript
---
If you work in web development, it's highly likely you've heard about React, VueJS, and Angular. In this article, I'll provide some context and compare the two options I've had the opportunity to work with, highlighting their advantages and disadvantages.

## Background

Some years ago, I decided to modernize how I built applications, especially on the frontend. I had stayed too long in my comfort zone with [Drupal](https://www.drupal.org/), which, while still a highly useful tool, also involved projects where the initial setup alone took much longer than it would likely take me to create a simple application.

I was hearing about more alternatives emerging for creating interfaces, and much of the market was experimenting with SPAs (Single Page Applications) and JAM Stack (Javascript APIs y Markup). So, I started to explore what was available.

I originally started with AngularJS, which later became simply [Angular 2](https://angular.io/) (at the time of writing this article, they are on version 13, and the initial version has been completely discontinued). Developed and sponsored by Google, it's a web application framework that's relatively easy to learn because it extends standard `HTML` with directives to simplify development. One significant drawback many found was that it enforced the use of TypeScript instead of JavaScript, and while this fundamentally offered advantages, it removed the option to choose. Additionally, it directly manipulated the `DOM` (which changed from version 2 onwards), contributing to slower performance.

The Angular development team eventually "accepted their defeat," acknowledging that the [React](https://reactjs.org/) team (the library created by Facebook) had a better-conceived design.

Because of this (and after encountering numerous performance issues when using Angular on mobile as applications scaled), I decided to make the switch and learn React.

## React

React is an extremely flexible JavaScript library specifically focused on building user interfaces. It is not "opinionated," meaning it gives us the freedom to use any components we desire for data management, state, routing, etc. While this freedom can sometimes work against us if we spend too much time choosing the right architectural pattern, the initial list of options can be overwhelming. However, with experience, this becomes simpler, and you'll develop a well-defined list of preferred tools.

It enables the creation of complex interfaces and experiences by building isolated pieces of code called "components." A recommended best practice is to integrate this with a tool like [Storybook](https://storybook.js.org/). This allows you to visualize how components look and behave without even connecting to a data source, facilitating the development of business logic completely isolated from styling.

To render its components, React uses a specific syntax called `JSX`, which visually resembles `HTML` (I'll discuss this in detail later). `JSX` allows translating the component definition into the element that will ultimately be displayed on the screen, which, in the case of the web, is an `HTML` tag.

This concept enables the separation of presentation logic from implementation, which also facilitated the birth of React Native. React Native maintains the core concepts of React but allows "translating" components to other devices, such as the web, desktop, or mobile phones.

## VueJS

Unlike React, Vue was designed with a more comprehensive definition, aiming closer to the `MVC` model. It not only handles a simple presentation layer but also includes more tools, such as state management. One of its advantages is its progressive usability; it doesn't require a complete application migration to leverage its benefits. It focuses on simplicity, providing the minimum—or what we might call the "just enough"—to create a functional application.

It employs the same component concept as React (aiming to leverage the best aspects of its predecessors) and integrates it with directives. This allows us to combine components with familiar `HTML`. Another feature of Vue is its support for both scoped `CSS` and global `CSS` (for those coming from React, it has its own `Styled Components` integrated as part of its design).

### Syntax

One of the major differences between Vue and React is how the view layer is constructed. By default, Vue uses `HTML` templates, but there's also an option to write in `JSX`. React, on the other hand, exclusively uses `JSX`, which means developers must first become accustomed to that syntax.

Vue, on its part, handles a "separation of concerns" using `HTML`, `CSS`, and `JS`. This allows even a beginner frontend developer to learn how to create a web application with minimal prior knowledge. You can even create a Vue application without installing any tools, simply by including Vue from a `CDN`.

Another advantage is that `HTML` templates make it very easy for web designers to understand the application's structure, facilitating collaboration between developers and designers.

React, with its `JavaScript Expressions` (`JSX`), combines `HTML` and `CSS` within `JavaScript`. This often confuses React newcomers, as it looks like `XML` but translates into objects once processed by the React "engine." Fundamentally, this is one of the framework's most powerful features, enabling the creation of "self-contained" UI components that can be shared and reused across different applications.

The approach developers take with both tools can help decide which one better aligns with their expectations and capabilities.

What developers who use Vue.js like:

*   Very easy learning curve
*   Elegant programming style that supports patterns.
*   Good Documentation

Developers who use React, on the other hand, enjoy:

*   An elegant programming style and good design patterns
*   An extensive package/component ecosystem
*   Widespread adoption (more job opportunities and support)

While in the [2020 Stack Overflow survey](https://insights.stackoverflow.com/survey/2020#most-popular-technologies) on most used frameworks, React was in 2nd place with 35.9%, by [2021](https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-web-frameworks) it had moved to first place with 40.14% (surpassing `jQuery`, which was previously number one).

![Most used Web Frameworks in 2021](/photos/screen-shot-2022-01-24-at-01.44.51.png "Most used Web Frameworks in 2021")

### Ease of Integration

**Vue.js** is considered a progressive framework, meaning it can be incrementally integrated into an existing project without needing to migrate the entire application. A simple example would be creating a specific interactive widget for a web application already using legacy code. The existing application can remain unchanged, with only the new functionality added using `VueJS`.

**React.js**, on the other hand, was originally conceived for large-scale projects. Therefore, if you only wanted to add a small feature, it would likely be more of a headache than an advantage. The initial setup and component selection would probably take longer than needed for a quick feature. However, it provides a superior architecture for large projects, so the benefits become apparent in the long term.

## The Right Tool Depends on Your Needs

`Vue.js` and `React` are both excellent tools for building user interfaces and interactive experiences. To choose the best one for your next project, multiple factors must be analyzed, starting with the specific use case, business needs, environment, developer availability, budget, and time constraints.

Vue is very lightweight, easy to learn, and enjoyable to use. With its simple syntax, if you're just starting to learn components or coming from the `jQuery` world, using it will be very straightforward, and the transition won't be painful. It works well for small projects but can also scale effectively for large applications.

In terms of performance, `Vue.js` is on par with `React`; however, it relies more on optimizations and application size. It boasts excellent documentation, explaining each element and providing detailed step-by-step guides.

Vue comes "batteries included," offering official packages for state management, routing, server-side rendering (`SSR`), and remains highly active. All of this combined allows for the rapid and efficient creation of `MVPs`.

React, for its part, is a "veteran" among JavaScript tools. With corporate backing, a tremendous community, and an extremely large ecosystem, React becomes an excellent tool for building enterprise-level applications. Another significant point is that precisely because of its widespread use and adoption, the job market has numerous opportunities available for those proficient with this tool. Similarly, finding information or seeking help will not be an issue.

Undoubtedly, there are more and new competitors constantly emerging in the frontend tools space. [Angular](https://angular.io/) continues with Google's support, [Svelte](https://svelte.dev/) has gained significant traction, [Alpine.js](https://alpinejs.dev/) is presented as a future replacement for `jQuery`, [Stimulus](https://stimulus.hotwired.dev/) also presents itself as another competitor—the list could go on indefinitely.

Ultimately, the most important thing is to solve a problem in the best possible way with the least impact on resource utilization. Therefore, I would always recommend maintaining a pragmatic approach and choosing the tool that best fits the project and the team. And if you have the opportunity to experiment and try, do it.

A professional recommendation for medium to large projects: pay attention to market trends. You don't want to get stuck with a tool that loses its "momentum," lacks support, or whose development stagnates, complicating your own project.