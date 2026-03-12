import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'posts.json');

export async function GET(request, { params }) {
    try {
        const { id } = await params; // Important: await params in Next.js 15+
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        const post = data.posts.find(p => p.id === id);
        
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}