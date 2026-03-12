import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'posts.json');

// This function handles the "fetch" call from your dashboard
export async function GET() {
    try {
        // Create file if it doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ posts: [] }));
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent || '{"posts":[]}');
        
        return NextResponse.json(data.posts || []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }
}

// This function handles the "Byte Now" button
export async function POST(request) {
    try {
        const body = await request.json();
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent || '{"posts":[]}');

        const newPost = {
            id: Date.now().toString(),
            author: body.author || "Guest",
            content: body.content,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };

        data.posts.unshift(newPost);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json(newPost);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}