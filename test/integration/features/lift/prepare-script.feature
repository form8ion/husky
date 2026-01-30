Feature: Prepare Script

  Scenario: replace legacy script with modern version
    Given the project has a legacy prepare script
    When the husky details are lifted
    Then the prepare script uses the modern command
