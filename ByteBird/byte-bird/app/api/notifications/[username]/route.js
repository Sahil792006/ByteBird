import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'notifications.json');

export async function GET(request, { params }) {
    const { username } = await params;
    try {
        if (!fs.existsSync(filePath)) return NextResponse.json([]);
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        // Filter notifications where the "to" field matches the logged-in user
        const userNotifications = data.notifications.filter(n => n.to === username);
        
        return NextResponse.json(userNotifications.reverse());
    } catch (error) {
        return NextResponse.json([]);
    }
}