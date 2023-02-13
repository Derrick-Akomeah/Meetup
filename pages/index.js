import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';

export default function HomePage(props) {
	return <MeetupList meetups={props.meetups} />;
}

// pre-generates page dynamically on every request instead on re-rendering on interval
// Runs on server after deployment never on client
// Pages with credentials should use this
// export async function getServerSideProps(context) {
// 	// fetch data here
// 	const req = context.req;
// 	const res = context.res;
// 	return {
// 		props: {
// 			meetups: DummyMeetups,
// 		},
// 	};
// }

// For static generation and rebuild on interval
// Runs during build process
export async function getStaticProps() {
	// Fetch data from an API or database or read data from a file system
	// After data fetch you need to return an object
	const client = await MongoClient.connect(
		'mongodb+srv://Kalacaazy:Bluelock72@cluster0.bpdz4kx.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');
	const meetups = await meetupsCollection.find().toArray();
	client.close();
	return {
		props: {
			meetups: meetups.map(meetup => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10, //Rebuilds page on server-side every 10seconds(time depends on number used)
	};
}
