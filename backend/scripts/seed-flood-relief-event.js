/**
 * Seed Script: Flood Relief Distribution — Koila Wala Gaon, Mathura
 * Date: 9 September 2025
 *
 * Run: node scripts/seed-flood-relief-event.js
 *
 * This script inserts:
 *  1. An Event record for the flood relief distribution
 *  2. Four Gallery items for each photo from the event
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import connectDB from '../config/db.js';

dotenv.config();

const BASE_IMAGE_PATH = '/images/events/flood-relief-mathura-2025';

const eventData = {
  title: 'Flood Relief Distribution — Koila Wala Gaon, Mathura',
  description:
    'On 9 September 2025, heavy flooding submerged Koila Wala Gaon near Refinery Town, Mathura. Namokriti International Foundation mobilised an emergency response team to distribute food supplies — including bananas, poori, packaged snacks, and cooked meals — to stranded families. Volunteers used boats to navigate the flooded streets, delivering essential supplies door-to-door to residents trapped in waist-deep water. The operation reached over 200 families in the affected area.',
  category: 'Community Service',
  image: `${BASE_IMAGE_PATH}/boat-supplies-distribution.jpg`,
  date: new Date('2025-09-09T09:00:00+05:30'),
  time: '9:00 AM — 4:00 PM',
  venue: 'Koila Wala Gaon, Near Refinery Town, Mathura, Uttar Pradesh',
  gallery: [
    `${BASE_IMAGE_PATH}/boat-supplies-distribution.jpg`,
    `${BASE_IMAGE_PATH}/street-food-distribution.jpg`,
    `${BASE_IMAGE_PATH}/doorstep-relief.jpg`,
    `${BASE_IMAGE_PATH}/team-coordination.jpg`,
  ],
};

const galleryItems = [
  {
    url: `${BASE_IMAGE_PATH}/boat-supplies-distribution.jpg`,
    mediaType: 'image',
    category: 'Disaster Relief',
    caption:
      'NIF volunteers transporting bananas, poori & food supplies via boat through floodwaters — Koila Wala Gaon, Mathura (9 Sep 2025)',
  },
  {
    url: `${BASE_IMAGE_PATH}/street-food-distribution.jpg`,
    mediaType: 'image',
    category: 'Disaster Relief',
    caption:
      'Door-to-door distribution of fruits, poori & packaged food in flooded streets — Refinery Town, Mathura (9 Sep 2025)',
  },
  {
    url: `${BASE_IMAGE_PATH}/doorstep-relief.jpg`,
    mediaType: 'image',
    category: 'Disaster Relief',
    caption:
      'Volunteer handing bananas to a resident stranded in waist-deep floodwater — Koila Wala Gaon, Mathura (9 Sep 2025)',
  },
  {
    url: `${BASE_IMAGE_PATH}/team-coordination.jpg`,
    mediaType: 'image',
    category: 'Disaster Relief',
    caption:
      'NIF team coordinating food relief with local residents amid heavy flooding — Mathura (9 Sep 2025)',
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('✅  Connected to MongoDB');

    // --- Insert Event ---
    const existingEvent = await Event.findOne({ title: eventData.title });
    if (existingEvent) {
      console.log('⚠️  Event already exists — skipping insertion.');
    } else {
      const event = await Event.create(eventData);
      console.log(`✅  Event created: "${event.title}" (slug: ${event.slug})`);
    }

    // --- Insert Gallery Items ---
    let insertedCount = 0;
    for (const item of galleryItems) {
      const exists = await Gallery.findOne({ url: item.url });
      if (exists) {
        console.log(`⚠️  Gallery item already exists: ${item.url} — skipping.`);
        continue;
      }
      await Gallery.create(item);
      insertedCount++;
    }
    console.log(`✅  Inserted ${insertedCount} new gallery items`);

    console.log('\n🎉  Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌  Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
