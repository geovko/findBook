<div align='center'>

# Thought Bubble

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Description

With social media platforms becoming more and more widespread, the ability of these platforms to handle large amounts of unstrctured data has become more important. As such, this project aims to provide an API for a social network that uses a NoSQL database.

Developing an API was not an unfamiliar task, but it was interesting utilizing a NoSQL database to implement the API.

## Usage

Access the Walk-Through video through the link provided below!

[Thought Bubble: Walkthrough Video](https://drive.google.com/file/d/1t2bvlzZTHmUZV4NIvmdpquQNJGrQDn62/view?usp=drive_link)

_OR_ Copy this link to paste into a browser.

```md
https://drive.google.com/file/d/1t2bvlzZTHmUZV4NIvmdpquQNJGrQDn62/view?usp=drive_link
```

This API includes two main models: 'User' and 'Thought'. In addition to the usual GET (all), Get (single), POST, PUT, and DELETE routes for each model, the API also include routes for 'friends' (other users) and reactions (attached to thoughts). The user is able to POST/DELETE another user to/from their friends list. They are also able to POST/DELETE to/from a thought's reactions list. Moreover, when a thought is created, it will be placed in the thoughts list of the user who's username matches the username of that thought.

## Credits

This project wouldn't have been completed without the aid of demonstrations and assignments provided by the UCI Bootcamp teaching staff.

## License

MIT License
