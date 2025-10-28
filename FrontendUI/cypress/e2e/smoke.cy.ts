describe("Smoke", () => {
  it("loads app shell", () => {
    cy.visit("/");
    cy.contains("Test Management").should("exist");
  });
});
