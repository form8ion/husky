Feature: Scaffolder

  Scenario: Scaffold for npm
    Given "npm" is the package manager
    When the project is scaffolded
    Then husky is configured for "npm"

  Scenario: Scaffold for yarn
    Given "yarn" is the package manager
    When the project is scaffolded
    Then husky is configured for "yarn"
