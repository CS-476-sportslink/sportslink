#Using User Stories to make effective use of GitHub Issues and Project Kanbans

##Brief Explanation of User Stories
For the purpose of properly using the kanban I feel it would be useful to understand User Stories and how to us them to create and organise useful tasks for our project. This can be a very long and detailed methodology, so I will try to keep it focused only on the aspects I feel we will need for our project.
Normally these user stories are brought up during planning meetings relatively early on in a project's life to organize which tasks to take on during the upcoming sprints. I would like to use them in our project to make sure we are not forgetting any key components for our project since we are already almost done.
You can also use user stories to rank tasks based on expected difficulty, but unfortunately I don't think we have enough experience as developers to properly rank task difficulty so we will leave this aspect out of our use case.
Essentially when writing a user story you’re trying to ask/answer a question that looks like: "As a **[user]** , I need **[function/tool]** so that I can accomplish **[goal]**." 
Once the user is able to complete their goal the story is considered done. In certain cases the goal that needs to be accomplished is too large/complex to fit into one task, in those case we can separate it into subtasks. Below I will give an example of how we could use user stories in our project to create/check that we are including everything needed in our project.

##Example
So in the case of sportslink you might ask something like this: (This of course is not an exhaustive list, it's mainly just to give us an idea of how to make use of the methodology)
	• "As an **athlete**, I need **to be able to upload videos/images**, so I can **display them on my profile**."
		○ So from this question we know we have a user type (athletes), a couple of features (uploading videos/images & displaying images/videos on a profile page), and a supporting requirement (profile pages)
		○ We could then create the following tasks:
			§ Create athlete mode
			§ Add video/image upload feature
			§ Create profile page
		○ We could then break them down further to look something like this:
			§ Create athlete model
				□ Create database file with stat fields for athletes
					® Create database
			§ Add video/image upload feature
				□ Create firebase project
					® Setup github action to deploy 
					® Invite group members to project
					® Add image/video hosting capability to firebase
			§ Create profile page
				□ Create layout for profile page
					® Create storyboard for general layout of all pages
					® Add ability to edit profile pages
						◊ Create edit profile page
