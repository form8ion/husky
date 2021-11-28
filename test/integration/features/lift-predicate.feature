Feature: Predicate to determine if the lifter applies to the current project

  Scenario: No Husky Installed
    Given husky is not installed
    When the predicate is evaluated against a project
    Then the predicate resolves to "false"

  Scenario: Modern Husky In Use
    Given husky v5 is installed
    When the predicate is evaluated against a project
    Then the predicate resolves to "true"

  Scenario: Legacy Config File In Use
    Given husky v4 is installed
    When the predicate is evaluated against a project
    Then the predicate resolves to "true"

  @wip
  Scenario: Legacy npm Scripts In Use
    When the predicate is evaluated against a project
    Then the predicate resolves to "true"
