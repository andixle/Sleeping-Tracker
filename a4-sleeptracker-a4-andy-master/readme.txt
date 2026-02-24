--Readme document for *author(s)*, *email(s)*, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?



3. What online resources did you consult when completing this assignment? (list specific URLs)



4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?



5. Is there anything special we need to know in order to run your code?

No special setup required. The app uses Ionic Storage for data persistence, which is automatically configured. Simply run 'npm install' and 'ionic serve' to start the app. All logged data will persist across app restarts using browser local storage.
--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

The app is designed for college students and young professionals who want to track their sleep patterns and daytime alertness. The interface prioritizes quick logging with minimal friction, recognizing that users may log sleepiness multiple times per day.
7. Did you design your app specifically for iOS or Android, or both?

The app is designed for both iOS and Android using Ionic's cross-platform framework. The UI follows mobile design principles that work well on both platforms, with responsive layouts and touch-optimized controls.
8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

Users tap "Log Overnight Sleep" from the home screen, then select their bedtime and wake time using date/time pickers with smart defaults (11 PM yesterday to 7 AM today). This approach assumes users log their sleep in the morning after waking up, which is more reliable than trying to remember to start tracking before bed.
9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

Users tap "Log Sleepiness Level" and select from the Stanford Sleepiness Scale (1-7) using radio buttons with full descriptions, then confirm the current date/time. The radio button interface with color-coded levels (green for alert, yellow for moderate, red for sleepy) makes it easy to quickly log multiple times per day, supporting experience sampling methodology.
10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

Users tap "View All Data" to see a comprehensive dashboard with statistics (total entries, averages), filtering options (all/overnight/sleepiness), and sorting controls (newest/oldest/type). This design provides both high-level insights through statistics and detailed entry-by-entry review, allowing users to analyze patterns in their sleep and alertness over time.
11. Which feature choose--using a native device resource, backing up logged data, or both?

I chose to implement both: backing up logged data using Ionic Storage AND using a native device resource (haptic feedback).
12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

I added haptic feedback using Capacitor's Haptics API, which provides tactile confirmation when users log sleep data. The device vibrates with different patterns for success (medium impact for overnight sleep, light impact for sleepiness) and errors (error notification), giving users immediate physical feedback that their action was registered without needing to look at the screen.
13. If you backed up logged data, where does it back up to?

The data backs up to browser local storage using Ionic Storage, which provides a unified API over IndexedDB, WebSQL, and localStorage. All overnight sleep and sleepiness data is automatically saved when logged and restored when the app restarts.
14. How does your app implement or follow principles of good mobile design?

The app follows mobile design principles through large touch targets (full-width buttons), clear visual hierarchy (card-based layouts), minimal input requirements (smart defaults for dates/times), and responsive design that adapts to different screen sizes. Navigation is intuitive with back buttons on all secondary pages, and the interface uses color coding and icons to provide visual feedback and reduce cognitive load.