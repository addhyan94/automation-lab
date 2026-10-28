Autonomous Coding Lab

AI-powered coding automation that builds, tests, and publishes code to GitHub.

«Status: Initial Setup
Runtime: Self-hosted Ubuntu Server
Language: Python
AI Providers: Google Gemini + Groq
Repository: "autonomous-coding-lab"»

1. Project Goal

Build an automated coding system that can:

- Generate code using AI.
- Create and update project files.
- Run basic tests and validate generated code.
- Commit and push changes to GitHub.
- Run scheduled tasks without manual intervention.
- Switch between Gemini and Groq when a provider reaches its rate limit.
- Resume scheduled work after a server restart.

2. Workflow

Scheduled Trigger
       |
       v
Load Configuration
       |
       v
Select Coding Task
       |
       v
AI Provider Manager
       |
       +----> Gemini API
       |
       +----> Groq API (Fallback)
       |
       v
Generate / Update Code
       |
       v
Run Tests & Validation
       |
       +----> Failed: Log Error
       |
       v
Git Status & Change Check
       |
       v
Git Add + Commit
       |
       v
Git Push to GitHub
       |
       v
Save Run Status & Logs

Rule: Do not push generated changes if validation fails or no meaningful changes exist.

3. Project Structure

autonomous-coding-lab/
├── README.md
├── requirements.txt
├── .gitignore
├── .env.example
├── config/
│   └── settings.json
├── tasks/
│   └── tasks.json
├── src/
│   ├── main.py
│   ├── ai_manager.py
│   ├── task_manager.py
│   ├── code_generator.py
│   ├── validator.py
│   ├── git_manager.py
│   └── logger.py
├── tests/
│   └── test_basic.py
├── logs/
└── state/
    └── status.json

This is the planned structure. Files will be added as each module is implemented.

4. Module Responsibilities

Module| Responsibility
"main.py"| Start and coordinate the workflow
"ai_manager.py"| Gemini/Groq selection and fallback
"task_manager.py"| Select and track coding tasks
"code_generator.py"| Generate and update code
"validator.py"| Run tests and validate changes
"git_manager.py"| Commit and push approved changes
"logger.py"| Record errors and execution history
"settings.json"| Runtime configuration
"tasks.json"| Coding task queue
"status.json"| Save progress and recovery state

5. AI Provider Strategy

1. Try the configured primary provider.
2. Detect rate limits and temporary provider errors.
3. Switch to the fallback provider when available.
4. Retry only when appropriate.
5. If both providers are unavailable, stop safely and save the task state.

API keys must be stored in environment variables or a protected ".env" file. Never commit secrets to GitHub.

6. Execution Modes

- Manual: Run the automation from the terminal.
- Scheduled: Execute tasks automatically at configured intervals.
- Recovery: Resume pending work after a restart.
- Safe mode: Validate generated changes before committing.

The scheduler and recovery mechanisms will be configured after the initial Git workflow is verified.

7. Setup

Requirements

- Ubuntu/Linux server
- Python 3
- Git
- GitHub repository and authentication
- Gemini and/or Groq API credentials

Initial Git Check

git --version
git config --global user.name
git config --global user.email
pwd

Verify the Git identity before creating commits. Use the email associated with the GitHub account if you want eligible commits to appear in its contribution graph.

Configuration

1. Configure the required API credentials.
2. Set the repository path and task settings.
3. Test AI connectivity.
4. Run one controlled coding task.
5. Validate the output.
6. Verify the commit and GitHub push.
7. Enable scheduled execution.

Exact commands will be documented after the implementation is ready.

8. GitHub Contributions

The system is intended to publish actual code changes and maintain a useful development history.

Contribution visibility depends on GitHub's contribution rules, including commit attribution, repository settings, and the branch receiving the commits. Scheduled runs alone do not guarantee green contribution squares or a daily streak.

9. Development Roadmap

- [ ] Verify Git installation and identity
- [ ] Verify repository access and push permissions
- [ ] Create the basic Python entry point
- [ ] Implement Git commit and push
- [ ] Verify a successful GitHub commit
- [ ] Connect Gemini API
- [ ] Add Groq fallback
- [ ] Implement task selection
- [ ] Add code generation and validation
- [ ] Add execution logs and recovery state
- [ ] Configure daily scheduling
- [ ] Test restart recovery and failure handling

10. Security Rules

- Never upload API keys, passwords, or tokens.
- Never run AI-generated shell commands without review.
- Never overwrite unrelated repositories or existing projects.
- Test changes before pushing.
- Keep logs free of secrets.
- Stop safely when validation or authentication fails.

---

Current milestone: Verify Git configuration and repository access before implementing the automation engine.