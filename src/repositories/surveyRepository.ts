import { sl } from "zod/locales";
import type {
  surveysCreateInput,
  surveysOrderByWithRelationInput,
} from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import type {
  CreateSurveySchema,
  ISurveyRepository,
  QueryString,
  Question,
  Survey,
} from "../types.js";

export default class SurveyRepository implements ISurveyRepository {
  defaultTake = 10;
  defaultSkip = 0;

  async getAll({
    search,
    active,
    date,
    page,
    limit,
    sort,
  }: QueryString): Promise<Survey[]> {
    const where: any = {
      deleted_at: null,
    };

    const orderBy: surveysOrderByWithRelationInput[] = [
      { created_at: sort === "creation" ? "asc" : "desc" },
      { name: sort === "-name" ? "desc" : "asc" },
    ];

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (active !== undefined) {
      where.is_active = active;
    }

    if (date) {
      const start = date;
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      where.created_at = {
        gte: start,
        lt: end,
      };
    }

    const results = await prisma.surveys.findMany({
      where,
      take: limit ? limit : this.defaultTake,
      skip: page ? (page - 1) * this.defaultTake : this.defaultSkip,
      orderBy,
    });

    const serializedData: Survey[] = results.map((r) => {
      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        questions: r.questions as Question[],
        isActive: r.is_active,
        createdAt: r.created_at,
        deletedAt: r.deleted_at,
        updatedAt: r.updated_at,
        activatedAt: r.activated_at,
      };
    });

    return serializedData;
  }

  async getBySlug(slug: string): Promise<Survey | null> {
    const result = await prisma.surveys.findFirst({
      where: { slug, deleted_at: null },
    });

    if (!result) return null;

    const serializedData: Survey = {
      id: result.id,
      name: result.name,
      slug: result.slug,
      questions: result.questions as Question[],
      isActive: result.is_active,
      createdAt: result.created_at,
      deletedAt: result.deleted_at,
      updatedAt: result.updated_at,
      activatedAt: result.activated_at,
    };

    return serializedData;
  }

  async createOne(survey: CreateSurveySchema & { id: string; slug: string }) {
    const data = {
      id: survey.id,
      slug: survey.slug,
      name: survey.name,
      questions: survey.questions,
    };

    const result = await prisma.surveys.create({ data });

    const serializedData: Survey = {
      id: result.id,
      name: result.name,
      slug: result.slug,
      questions: result.questions as Question[],
      isActive: result.is_active,
      createdAt: result.created_at,
      deletedAt: result.deleted_at,
      updatedAt: result.updated_at,
      activatedAt: result.activated_at,
    };

    return serializedData;
  }

  async deleteOneBySlug(slug: string): Promise<void> {
    await prisma.surveys.update({
      where: { slug },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async updateOneBySlug(slug: string, data: any): Promise<Survey | null> {
    const result = await prisma.surveys.update({
      where: { slug },
      data,
    });

    const serializedData = {
      id: result.id,
      name: result.name,
      slug: result.slug,
      questions: result.questions as Question[],
      isActive: result.is_active,
      createdAt: result.created_at,
      deletedAt: result.deleted_at,
      updatedAt: result.updated_at,
      activatedAt: result.activated_at,
    };

    return serializedData;
  }

  async getSlugBySlug(slug: string): Promise<Pick<Survey, "slug"> | null> {
    const result = await prisma.surveys.findUnique({
      where: { slug, deleted_at: null },
      select: { slug: true },
    });

    if (!result) return null;

    const serializedData = {
      slug: result.slug,
    };

    return serializedData;
  }

  async getActivatedAtBySlug(
    slug: string,
  ): Promise<Pick<Survey, "activatedAt"> | null> {
    const result = await prisma.surveys.findUnique({
      where: { slug, deleted_at: null },
      select: {
        activated_at: true,
      },
    });

    if (!result) return null;

    const serializedData = {
      activatedAt: result.activated_at,
    };

    return serializedData;
  }
}
