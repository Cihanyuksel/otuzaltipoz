import { FaHeart, FaComment } from 'react-icons/fa6';

const UserProfile = () => {
  const user = {
    name: "Sophia Bennett",
    username: "@sophia.b",
    bio: "Fotoğrafçı | Gezgin | Hayalperest",
    profilePicture: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy3eLVinbuy4vEOWHprF4SM2yG5F5VzIt_O3A_a37JfnaXdcGROoDmR1DTyqFjWm6r7cbglAr_zoLgUXXzh0LjIiSJcHpUTtfZjZx1eclTUKZAQeasubn6OwxrUfzMMjLINgYAoLu0nnEvqt0_dGnwQPFqLHezR3j6aWnyaStestiUxyBiEFUaMZbRKT3UEfJooa48mvxv7OT-wBm0w1-lEs2JFdnd34VhocBhxJdqweYgLC1shPFnO3LkYcNbHzvq3McXdqkkcfo",
    photos: [
      { id: 1, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4hOAXoxGG00urq1XUH79LxUtkJiutbzfehPz0rL1Z1p1540nGq_gnVAOyQE107IMIVadL4yNfbBOMQBUeGOcyVtYQ4X-uFnPGvIZxRfd5RdueCNb5Zc3NNQI09Yk9auh8ux7_7xulSDqaG7iuQXWQ6z0Bfcx6bjZS0tl0zeNFK1Kp9zkWFroT4cACRQFOmzjNxEeWI9_a2Dw3kPXsX6taidB9wq37Q3uTSo5tlgKV5KYNlK5kB3HmbMkhH_6YCKKjavNEs1uiZJU", likes: "1.2k", comments: "87" },
      { id: 2, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4hHxIv8YVSb-ZnAIqSLula1XJY9fFBg1es_PuJGk4lLpuMmnnWMz6EyxhbRiSKK20ccVw6anuc2T4yowKEN-AWrzS3flgUvNvyjbhZusfoENsT7eqMUcDz3EqDdGrOdcSC686aATQk_eK7V8WNXa7zT1r8Z_IX7czehpN25xQvJRdaobfc1SUcrUoadAdDNcR-S7hASUdvvVsS1Wju1JJ2VCMd8bDa2afTjB4WF0hz3rOAriWMoRPvRSOn580UkcYJK0huBt4zSw", likes: "980", comments: "54" },
      { id: 3, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtEV2V2qqQxeLXKkWtAOeN-8VpOkMKqgJrwj3NkwWLNfF16lLxQ7zLZP0h2_MeVdr6y_XQzdLrxy88fHOqWrzWLlPzRpjYWnnx44Rk8Q7c6cgUGVE3Xzrcx12KOpSsd_hLBwJvGlpybmEiLQShtX1mpojEyoMo3_KdYugFgLyqpQv6Zfl1wOJIwgAPqK8VgJ3UfyrsDApwUI8OKDCIZCSaaNvrawit4pEkd3Q8Sd8DigOZZoduI-aPTwiIMId0F5e4w4UEsNvIO5w", likes: "2.1k", comments: "123" },
      { id: 4, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyk8eOjmw-JW6iT2ps-xRZ2S-QgEMZMMFniw7CvDBIEB10rW0AFrUbP58vs87A25_tcWzFLvrMdOhShEtj59RuiupCpwGJdWSCimcCg0PO-y4r6et3fQfkRPU-NYYCQg0DtMVjJ9qZhJ5LlrOXByLvIF9nmf9oqd-MC-X4HvPY1z5xoFhuK_aGc4erxS-A60wlDh5UR9BIb_neg_MAUBGk9mGIHcsFOPck5x2mmzOnPyqSEjXmFUaeGiDrOsqKL_0SAc5Jl-_zhIY", likes: "850", comments: "42" },
      { id: 5, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA92z29Jc-Zo9W0es3WzOWfx4Y6dRdp5n4lAFo5z4jJ63aQcC4RyTIN3srr14ORuZMhaOVjyEXsdCRpOID1m1AJJ01xpdhYBX-QOlY_B5kCWxjLbmX5h7NhKFk3MOO3SzosZUVALLoTvZKUTZyAUvyI746jNbHd828N4D7z_fVzbU_rOdUcMeYkxj-1cAYfWnrVwAfxDQwVZ2ZDDxn_bAyIxvQT0UFyWyABwejUyIf8XYXwaX1iTYsakpACIOiLXFGgqASvNkMRvE", likes: "3.5k", comments: "210" },
      { id: 6, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBukmlUir1TDVwMnXOtFzhMblScL4Spkzbw30nkGFazYd2alGtAdGd4PrEkxk8JfqcTLVh027Eh8hJhHHflBjmuBAHCzdZ97_-TTQVBaDArtLo3QWXih99nIn9Xj9FHa4ZeGuOt1d3e4V4WOpO_RQ2MX2yTD7P8UqnXVFiHhOpbe_Zr0O1FzzUg5S3UPPZQWJNhwG2tHo9PdWIjMFDZhNEzqDzW8wOn7EpsdU_3uI3lEi226hvDjrR0y54pGQxwAICPppiZbk1kqbk", likes: "720", comments: "33" },
      { id: 7, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7C8IPbDRefbiiQ0GMr6R1teXj9gdpdSwYsw2Fp0IhiuoXHznNfDQEIYj0KBhswXp0Arjl7DwM1bQ7ogDoPaHMvqi48DZXw26v-XkPSM6JqAvRk0stZEg_C3uPVZoQOME1JkLYEZUSr2IAVZnkQ5BgoywTT9pjM71rW1dBNMjUrvlvzh_0bLoqjZHiAo6onMLMRJCzmyCMYVXaZawxYT-06ku8wqwfOdZ3WWLj76rmWyXFrqIr4a-UZ-yi0ctMSHMEjJTQq4vxzkw", likes: "1.8k", comments: "95" },
      { id: 8, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAdU42IfJvQQQ6mqYcr8VX8jNXYRU-WZKWy_WFGRIyncwDGlb0R7WDiXOvkHF3QRWZ9yHe-X7Pysm6bZ5SzfXA3bVV4z2AAITZMnzq3UYnOOOTqY2r69MPDxDHH34SpkEjGYfIIyPU8ETyTSeE--rOAmfbw3U9cBziW4pXsm2GIwu5rVsbqHVjkwYF54Q-p_wuVolJZQ0rjWguLmgQLzcIv1hvQWc2iPMHHQV3F-d7a-I80j49aearNQHoC7dXw7dFbfE3MaOB8TQ", likes: "4.2k", comments: "340" },
      { id: 9, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeKsUKEr2zQWrWi0LZnp64MZdiCbS3en5gdqPZ1nBUEMbNhcZVzwuefEWI3cLDOQlU8fgAafJsMfYxpuw0j7j4u37bxv8IBOj3Tt1iVZcrJORHecmEeVz3TQO3eN1XkXVKiOPNamm8rMqBrZCD89DX0Q-p_BYuB6TSffm4_pbXeXiN0YOxQch27ncqt6G89JzArEoFOzzlw4h72XwQz581bUQHMfWQeEpYeSLn90xN2z3hr05GNXW4Rcil7ccyD5NlMSlQhTDqSiU", likes: "650", comments: "28" },
      { id: 10, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmQ9b7_poGjq5MHsswQAVxfzDEIusZZc3PN6C1N-KQtsQdk4THAvGvYQjBGkg08yOzQj5X0IlPkw-lB3Ktkk6ep-IG9A1vyP0_9D7z-iWSz8mfMftyXBWNpxPOuUy3sPgPuNATZJAx9GKC3T2UTu1WvkAX5KJD2sQAH4Rd92SrZgRNBB_MJLNx07KxHeQeU62Ne5QJpL5eLdo_nRKFlcHKil9XK8DGerEslgUGzanuo8YV0uS1F4HQIWmbV6hldLL-pSB6qMYzc14", likes: "1.1k", comments: "76" },
      { id: 11, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfoZTEJ9yr5Ao-F2ZfgOWAjyGuKyedYljOmgTbV8WSdBmB-hNgse13SZWQd8atUcF05VhijrkvSNvbZ9mXF7I7ZgFZgj5_bl1987AtJMkh5ag4aSwnDEtMRB_lP7YyHE0mx56FnNsB0k8gnR8xQOp-LwVQOD5AqkaBH4XGdxF8oZUFK2TscRBOirZMSJGoYdEddhdtICjYDlgwlyOR1fjGi1QMIvtyCB355zI6jKRvQ65ytAbYnmOHuovfNvxxwmFeTzsN_KXL-lE", likes: "2.8k", comments: "189" },
      { id: 12, src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpFrOWc0FyfAiA-8CvUGgGJ_xwFpZsDwTnoo7rABmBGa37Bz59s8laeA76ws9JTeZ3oe_Ab1hVuXxNHUET9s6hZ0OTY4kBHJbjFH7RVUy1wXB11E_npy-YSikbtnFrFjovfLNOIozPL4b41Qk2WVr4RqWPnPwuhzinzh-MsYJxQtdvLVkZIDDquGl24NgkB4wDalf8kHae-2ngl9IRtTmzv8-P4J7omr67DzGC-ExXTIUyaZHysKY-tZ6hufqRoORMNymZx70TH20", likes: "990", comments: "61" },
    ]
  };

  return (
    <section className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
          <div
            className="h-32 w-32 flex-shrink-0 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url("${user.profilePicture}")` }}
          ></div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-md text-[#957a50]">{user.username}</p>
            <p className="mt-2 text-base text-[#1b160e]">{user.bio}</p>
          </div>
        </div>

        <div className="mt-12">
          <div className="border-b border-[#d3deda]">
            <nav className="-mb-px flex space-x-8">
              <a
                className="whitespace-nowrap border-b-2 border-[var(--primary-color)] px-1 py-4 text-sm font-semibold text-[var(--primary-color)]"
                href="#"
              >
                Yüklenenler
              </a>
              <a
                className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-[#957a50] hover:border-gray-300 hover:text-gray-700"
                href="#"
              >
                Beğenilenler
              </a>
            </nav>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {user.photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square">
                <div
                  className="h-full w-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url("${photo.src}")` }}
                ></div>
                <div className="absolute inset-0 flex h-full w-full items-center justify-center gap-4 rounded-lg bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-1">
                    <FaHeart className="text-lg" />
                    <span className="text-sm font-medium">{photo.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment className="text-lg" />
                    <span className="text-sm font-medium">{photo.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;