---
title: "Hosting a website on a Mac Mini"
description: "My journey to hosting a website on a Mac Mini"
publishDate: "25 Jan 2024"
tags: ["Selfhosting", "Mac Mini" ,"IT", "Tech", "Go"]
draft: false
---
## Why? 
So you might be wondering why would you host a website from a Mac mini?? There are so many better options out there. Well, I wanted to learn what was is the black box that is hosting a website. I wanted to learn how to do it myself. I wanted to learn how to do it on a Mac mini.

## Why a Mac mini?
At first i was going to buy a raspberry pi and host it on that. But, I know myself. The automation engineer in me would have hooked the thing up to some servo motors and made it do something stupid. I started to lean towards a mac mini since they were relatively cheap, I was comfortable with the OS and I could use it for a lot more than just hosting a website.

## Getting Started
The baseline specs of the machine I bought are: 
- 2021 M1 Mac mini
- M1 8-core CPU
- 8GB of memory
- 250GB SSD

I got the machine from amazon for $450 refurbished which is a steal. I also have a 1TB external drive laying around that I can use for more storage.

First thing first is get the machine set up. The final resting point will be behind the tv hardwired into our router. But for now I'll have to bring it to my desk to get it set up. First I updated the OS. The machine came with Venture installed. I updated to Sonoma. I also removed all the bloatware that came with the machine.  Next I installed homebrew, go, git, and node using Webi. Webi is a great tool for installing all the tools you need for web development. You can check them out here: https://webinstall.dev/ (shout out to Lane from [Backend Banter](https://www.backendbanter.fm) for showing me this tool).

### Setting Up The Modem and Router
To get access to your configuration settings in your modem you need to go to you local IP address. For me it was 192.186.0.1. Enter your username and password. If you don't know what they are you can find them on the back of your modem. Once you are in the settings you need to find the DMZ settings. This will allow you to forward all traffic to your Mac mini. I opened port 80 and 443 You will need to enter the IP address of your Mac mini. You can find this by going to `System Preferences > Network`. You will see your IP address there. Or you can go to your terminal and type `ipconfig getifaddr en0`. This will give you your IP address. We'll revisit this in a bit. I still have bunch of stuff to do before we let the world talk to the Mac mini, she's just a kid.

### What's Next?
For now I'll enable ssh. To do that is easy. Go to `System Preferences > Sharing > Remote Login.` This will allow you to ssh into your machine. I also set up a static IP address for my machine. This will allow me to access my Mac mini from my main laptop. I'll be using the terminal to ssh into my Mac mini. I know I can remote into it using the screen sharing app but I want to get comfortable with the terminal. 

I'll keep yall posted on my progress. Next we'll have to figure out how to respond to requests from the outside world, get a domain name, and set up a reverse proxy. Until then.... 


TTYL ILY <3

-b



