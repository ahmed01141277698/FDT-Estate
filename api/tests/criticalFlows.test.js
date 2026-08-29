import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Job from "../Models/jobModel.js";
import Article from "../Models/articleModel.js";
import ContactMessage from "../Models/contactMessageModel.js";
import {
  listPublishedJobs,
  listPublishedArticles,
} from "../Services/adminContentService.js";

describe("Critical platform flows", () => {
  it("should have job model schema ready for publishing", () => {
    assert.ok(Job.schema.paths.title);
    assert.ok(Job.schema.paths.slug);
    assert.ok(Job.schema.paths.status);
    assert.ok(Job.schema.paths.department);
  });

  it("should have article model schema ready for blog content", () => {
    assert.ok(Article.schema.paths.title);
    assert.ok(Article.schema.paths.slug);
    assert.ok(Article.schema.paths.content);
    assert.ok(Article.schema.paths.seo);
  });

  it("should have contact message model schema ready for support tickets", () => {
    assert.ok(ContactMessage.schema.paths.email);
    assert.ok(ContactMessage.schema.paths.category);
    assert.ok(ContactMessage.schema.paths.status);
    assert.ok(ContactMessage.schema.paths.priority);
  });

  it("should return predictable shapes for published jobs and articles query helpers", async () => {
    const jobs = await listPublishedJobs({ page: 1, limit: 10 });
    const articles = await listPublishedArticles({ page: 1, limit: 10 });

    assert.ok(jobs && Array.isArray(jobs.jobs));
    assert.ok(jobs.pagination && Number.isInteger(jobs.pagination.page));
    assert.ok(articles && Array.isArray(articles.articles));
    assert.ok(
      articles.pagination && Number.isInteger(articles.pagination.page),
    );
  });
});
