export function ComingSoon() {
  return (
    <div class="w-full bg-gray-200 font-sans leading-normal tracking-normal">
      <section class="bg-white py-20">
        <div class="container mx-auto px-4">
          <div class="mx-auto max-w-2xl text-center">
            <h1 class="mb-6 text-4xl font-bold">We're launching soon</h1>
            <p class="mb-12 text-gray-600">
              Enter your email to be the first to know when we launch.
            </p>
            <form class="mx-auto max-w-md">
              <div class="flex items-center">
                <input
                  type="email"
                  class="mr-3 w-full rounded-md bg-gray-100 px-4 py-2 focus:bg-white focus:outline-none"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  class="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section class="bg-gray-200 py-20">
        <div class="container mx-auto px-4">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="mb-6 text-3xl font-bold">What to expect</h2>
            <p class="mb-12 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec
              orci quis justo aliquam euismod eget a leo. Sed eget orci feugiat,
              porttitor nibh vel, faucibus mauris.
            </p>
          </div>
          <div class="-mx-4 mt-12 flex flex-wrap">
            <div class="mb-8 w-full px-4 md:w-1/3">
              <div class="rounded-md bg-white p-8 shadow-md">
                <div class="mb-4 text-4xl font-bold text-purple-600">01</div>
                <h3 class="mb-4 text-2xl font-bold">Feature 1</h3>
                <p class="mb-4 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  nec orci quis justo aliquam euismod eget a leo.
                </p>
              </div>
            </div>
            <div class="mb-8 w-full px-4 md:w-1/3">
              <div class="rounded-md bg-white p-8 shadow-md">
                <div class="mb-4 text-4xl font-bold text-purple-600">02</div>
                <h3 class="mb-4 text-2xl font-bold">Feature 2</h3>
                <p class="mb-4 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  nec orci quis justo aliquam euismod eget a leo.
                </p>
              </div>
            </div>

            <div class="mb-8 w-full px-4 md:w-1/3">
              <div class="rounded-md bg-white p-8 shadow-md">
                <div class="mb-4 text-4xl font-bold text-purple-600">03</div>
                <h3 class="mb-4 text-2xl font-bold">Feature 3</h3>
                <p class="mb-4 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  nec orci quis justo aliquam euismod eget a leo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
