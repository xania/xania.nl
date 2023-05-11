export async function jobfeed() {
  return [
    job("Software developer .NET"),
    job("Scrum master"),
    job("Full-stack developer"),
    job("Front-end developer"),
  ];
}

function job(title: string): Job {
  return {
    title,
  };
}

export interface Job {
  title: string;
}
