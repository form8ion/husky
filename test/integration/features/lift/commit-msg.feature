Feature: Commit Message

  Scenario: No Commit Convention Defined
    Given no commit convention is defined
    And husky v5 is installed
    And husky config is in v5 format
    When the husky details are lifted
    Then no commit-msg hook is defined

  Scenario: commitlint config exists
    Given commitlint is configured for the project
    And husky v5 is installed
    And husky config is in v5 format
    When the husky details are lifted
    Then commitlint is configured as a commit-msg hook
