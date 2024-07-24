import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  try {
    await prisma.studio.deleteMany();
    await prisma.studio.createMany({
    data: [
        {
            id: 1,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Pluit Brt Raya 29, Dki Jakarta, Jakarta",
            description:"A slender, cream skinned man with steady, blue eyes, defined cheekbones, large ears, a softly shaped jaw and thin eyebrows. He is bald, wears neutral-coloured formal clothes, has a very long, tufty Fu Manchu moustache, has large feet, weak arms, and a short neck, and he seems controlling.",
            name: "Character Illustration with Adobe Illustrator",
            price: "Rp. 300.000",
        },
        {
            id: 2,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Raya Perancis Bl A-2/11,Kosambi Barat",
            description:"A tall and leggy, red-brown skinned man with thoughtful, dark brown eyes, a triangular face, angular eyebrows and smooth cheeks. He has fine, black hair, wears multiple bronze bracelets on both wrists, has short arms, small hands, and narrow shoulders, and he seems cool.",
            name: "UI UX Website Design for Beginner with Figma",
            price: "Rp. 340.000",
        },
        {
            id: 3,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Daan Mogot Km 11/35 Kedaung Kaliangke, Dki Jakarta",
            description:"A short and petite, bronze skinned woman with gentle, light brown eyes, puffy cheeks and large ears. They appear androgynous, and act feminine. She has straight, dark brown hair, seems respectful, and she has a long, messy moustache. She is holding something that doesn't belong to her.",
            name: "Mastering Web Developer Bootstrap 5",
            price: "Rp. 280.000",
        },
        {
            id: 4,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Tebet BrtIV 20 Ged SWP Lt 1 125,Tebet Barat",
            description:"A slender, pasty skinned man with vibrant, blue eyes, a long face and an aquiline nose. He has straight, light brown hair dyed pistachio, has slanted shoulders, a long neck, and average-sized feet.",
            name: "Mastering Logo with Adobe Illustrator",
            price: "Rp. 420.000",
        },
        {
            id: 5,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Dr Sam Ratulangi 9-15, Dki Jakarta",
            description:"A wide, red-brown skinned woman with stern, brown eyes, angled lips, angular eyebrows, a bulbous nose and small ears. She has wavy, dark brown hair, has a distinctive welt on her left foot, has nice cologne, and she has an impressively long, perfectly shaped moustache and matching beard.",
            name: "3D Modelling for Beginner with 3D Blender",
            price: "Rp. 380.000",
        },
        {
            id: 6,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Letjen South Parman 66 A, Jakarta",
            description:"-",
            name: "Mastering Icon Design with Adobe Illustrator",
            price: "Rp. 300.000",
        },
        {
            id: 7,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl Jend Sudirman Kav 52-53",
            description:"A tall and very fat, rosy skinned man with perceptive, yellow eyes, a bulbous nose and narrow lips. He is bald, has a bad smell, wears persimmon eyeliner, and he wears clothes that are slightly too small. He is sleeping. ",
            name: "Design Vektor with Corel Draw CC for Beginner",
            price: "Rp. 340.000",
        },
        {
            id: 8,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"Jl PLN Duren Tiga 53-55, Dki Jakarta",
            description:"A short and petite, dark skinned man with analytical, hazel eyes, defined cheekbones and a wide face. He has wavy, light brown hair, has a short neck, small hands, and long legs, wears clothes that are revealing, has a traditional tattoo on his right arm, and he seems misleading. He is jumping.",
            name: "UI UX Design with Adobe XD for Beginner",
            price: "Rp. 400.000",
        },
        {
            id: 9,
            image:"https://img.lovepik.com/bg/20231225/studio-playing-music-with-a-piano_2489952_wh860.png",
            address:"A short and diminutive, ruddy skinned man with dazzling, red eyes, well-groomed eyebrows, a triangular face, defined cheekbones and ears that stick out. He is bald, has a short, uniquely styled, perfectly shaped moustache, has a malocclusion (bucktooth), and he has tattoos fully covering his neck, torso, feet and left hand.",
            description:"Kompl PIK Bl B/174, Dki Jakarta",
            name: "Mastering Mobile Developer with Flutter",
            price: "Rp. 320.000",
        },
    ]
});
console.log('Seeding completed.');
} catch (error) {
  console.error('Seeding failed:', error);
} finally {
  await prisma.$disconnect();
}
};

seed();
