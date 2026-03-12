import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const postsPath = path.join(process.cwd(), 'posts.json');
const notifPath = path.join(process.cwd(), 'notifications.json');

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const { type, username, commentText } = await request.json();
        
        // 1. Load Posts
        const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
        const postIndex = postsData.posts.findIndex(p => p.id === id);
        if (postIndex === -1) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        let post = postsData.posts[postIndex];
        if (!post.likes) post.likes = [];
        if (!post.comments) post.comments = [];

        let shouldNotify = false;

        // 2. Handle LIKE
        if (type === 'LIKE') {
            if (post.likes.includes(username)) {
                post.likes = post.likes.filter(u => u !== username);
            } else {
                post.likes.push(username);
                shouldNotify = true; // Only notify on new likes
            }
        }

        // 3. Handle COMMENT
        if (type === 'COMMENT') {
            post.comments.push({
                id: Date.now().toString(),
                author: username,
                text: commentText,
                timestamp: new Date().toISOString()
            });
            shouldNotify = true;
        }

        // 4. SAVE POST DATA
        postsData.posts[postIndex] = post;
        fs.writeFileSync(postsPath, JSON.stringify(postsData, null, 2));

        // 5. CREATE NOTIFICATION (The missing piece!)
        // We only notify the author if the person interacting is NOT the author
        if (shouldNotify && post.author !== username) {
            if (!fs.existsSync(notifPath)) fs.writeFileSync(notifPath, JSON.stringify({ notifications: [] }));
            
            const notifData = JSON.parse(fs.readFileSync(notifPath, 'utf-8'));
            const newNotif = {
                id: "notif_" + Date.now(),
                to: post.author,      // The person receiving the alert
                from: username,       // The person who liked/commented
                type: type,           // 'LIKE' or 'COMMENT'
                postId: id,
                timestamp: new Date().toISOString()
            };

            notifData.notifications.push(newNotif);
            fs.writeFileSync(notifPath, JSON.stringify(notifData, null, 2));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Action Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}