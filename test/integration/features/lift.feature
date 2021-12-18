Feature: Husky

  Scenario: Husky v5 installed, v4 config
    Given husky v5 is installed
    And commitlint is configured for the project
    And "npm" is the package manager
    And husky config is in v4 format
    When the husky details are lifted
    Then husky is configured for "npm"
    And the v4 config is removed
    And commitlint is configured as a commit-msg hook

  Scenario: Husky v5 installed, v3 config
    Given husky v5 is installed
    And "npm" is the package manager
    And husky config is in v3 format
    When the husky details are lifted
    Then husky is configured for "npm"
    And the v3 config is removed

  Scenario: Husky v5 installed, v5 config
    Given husky v5 is installed
    And husky config is in v5 format
    When the husky details are lifted
    Then the next-steps do not include a warning about the husky config

  Scenario: Husky v4 installed, v4 config
    Given husky v4 is installed
    And husky config is in v4 format
    When the husky details are lifted
    Then the next-steps do not include a warning about the husky config
