import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import WorkspaceTerminal from "../../app/components/WorkspaceTerminal.vue";

describe("WorkspaceTerminal", () => {
  it("renders workspace progress in order", () => {
    const component = mount(WorkspaceTerminal);
    const rows = component.findAll("[data-state]");

    expect(rows.map((row) => row.findAll("span")[0]?.text())).toEqual([
      "✓",
      "✓",
      "●",
      "●",
      "○",
    ]);
    expect(rows.map((row) => row.findAll("span")[1]?.text())).toEqual([
      "domain connected",
      "workspace initialized",
      "portfolio under construction",
      "articles being prepared",
      "experiments queued",
    ]);
    expect(rows.map((row) => row.attributes("data-state"))).toEqual([
      "complete",
      "complete",
      "active",
      "active",
      "queued",
    ]);

    const details = component.findAll(".workspace-terminal__detail");

    expect(
      details.map((detail) => [
        detail.get("dt").text(),
        detail.get("dd").text(),
      ]),
    ).toEqual([
      ["STATUS", "building"],
      ["RELEASE", "next"],
      ["LAUNCH", "soon"],
    ]);
  });

  it("provides an accessible summary for the decorative terminal", () => {
    const component = mount(WorkspaceTerminal);
    const terminal = component.get("section");

    expect(terminal.attributes("aria-label")).toBe(
      "t7n.dev workspace status",
    );
    expect(component.get(".workspace-terminal__visual").attributes("aria-hidden")).toBe(
      "true",
    );
    expect(component.get(".sr-only").text()).toContain(
      "The t7n.dev workspace is being built.",
    );
  });
});
