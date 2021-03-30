Feature: Commit Message

  Scenario: No Commit Convention Defined
    Given no commit convention is defined
    When the project is scaffolded
    Then no commit-msg hook is defined

  Scenario: commitlint config exists
    Given commitlint is configured for the project
    When the project is scaffolded
    Then commitlint is configured as a commit-msg hook
