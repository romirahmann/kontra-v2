import { error, success } from "@/lib/response.config";
import { insertView } from "@/model/views.model";

export async function GET(req, { params }) {}

export async function POST(req, { params }) {
  const { slug } = await params;
  try {
    const result = await insertView(slug);

    return success(result, "View recorded successfully");
  } catch (err) {
    console.log(err);
    return error("Internal Server Error", 500);
  }
}

export async function PUT(req, { params }) {}

export async function DELETE(req, { params }) {}
