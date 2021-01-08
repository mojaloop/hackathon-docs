# ./seed


## Seeding the hackathon environment:

1. Edit the files in `./config.ts`

2. Set the necessary env vars:
```bash
export ELB_URL=beta.moja-lab.live/api/admin
```

2. Run the seeder
```bash
npm run reseed:docker-live
```