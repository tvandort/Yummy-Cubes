const placeholderNames = [
  'John',
  'Jade',
  'Rose',
  'Dave',
  'Jake',
  'Roxy',
  'Dirk',
  'Jane'
];

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

const randomName = () => placeholderNames[randomInt(placeholderNames.length)];

export default function NamePrompt() {
  return (
    <form>
      <label className="flex flex-col text-center space-y-4">
        <span className="font-bold text-lg">What's your name?</span>
        <div>
          <input
            className="border px-3 py-2"
            placeholder={`e.g. ${randomName()}`}
          />
          <button className="border-t border-r border-b border-blue-600 bg-blue-600 text-white px-3 py-2 flex-no-wrap">
            Go!
          </button>
        </div>
      </label>
    </form>
  );
}
