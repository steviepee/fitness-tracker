import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardWorkouts from './DashboardWorkouts.jsx';
import DashboardMeals from './DashboardMeals.jsx';
import { DateCalendar,
   LocalizationProvider,
   StaticDatePicker,
  // DemoContainer,
  // DemoItem,
  DatePicker,
 } from '@mui/x-date-pickers';
 import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
 import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
/**
 * import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
 */
import { Divider,
   Grid2,
   Container,
   Box,
   FormControl,
   TextField,
   Input,
   FormHelperText,
   Button,
   Typography,
  } from '@mui/material';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
  import dayjs from 'dayjs'
  import { LineChart, ChartsTooltip } from '@mui/x-charts'
  
  
  
  const Grid = Grid2;
  export default function Dashboard(props) {
    let date = Date();
    // weight and goal weight are set to state to hold the info in the forms before submitting them to the db
    const [ weight, setWeight ] = useState('');
    const [ goalWeight, setGoalWeight ] = useState('');
    // ----------------these db goal elements are set to get the info straight from the database 
    // after a submission has occurred---------------------
    const [ dbWeight, setDbWeight ] = useState('');
    const [ dbGoalWeight, setDbGoalWeight ] = useState('');
    const [ dbWeightEndpoint, setDbWeightEndpoint ] = useState('');
    // separate the tuples in db progress array into dbWeightX and dbWeightSeries
    const [ goalProgress, setGoalProgress ] = useState('')
    const [ dbWeightX, setDbWeightX ] = useState([]);
    const [ dbWeightSeries, setDbWeightSeries ] = useState([]);
    const [ pickDate, setPickDate ] = useState(dayjs(date));
    const [ isDisplay, setIsDisplay ] = useState(false);
    /**
     * Adding FormControl must be separate per each input field to avoid visual errors.
     * But I'm currently working on getting the form to the part of the grid I'm specifying.
    */
   // prolly just part of a helper, but it adds the endpoint to the end of the graph[eventually along with the end date]
   // dbWeightX.push(dbWeightEndpoint)
   
   // create a get function for rerendering the user info after changes
   //if there's a goal entered in, render the reader of that info. Otherwise, render as normal
   const getUserGoals = () => {
     axios.get('/user/info')
     .then(({ data }) => {
       if(data.weight !== null){
         setDbWeight(data.weight);
        };
        if(data.goalWeight !== null){
          setDbGoalWeight(data.goalWeight);
        };
        setDbWeightEndpoint(data.weightEndpoint);
        setGoalProgress(data.weightProgress);
        // map out the weight progress array of tuples to separate them into graph points
        let arrayX = [goalWeight]
        let arraySeries = [1.03]
        data.weightProgress.forEach((tuple) => {
          arrayX.push(tuple[0]);
          arraySeries.push((11 + tuple[1]) / 10);
        });
        // replace the corresponding state arrays with the above arrays
        setDbWeightX(arrayX);
        setDbWeightSeries(arraySeries);
        
        
        
        
      })
      
      
      .catch((err) => {
        console.error('Could not GET goals', err)
      });
    }
    let progress = goalProgress
useEffect(() => {

  getUserGoals()
}, []);
// const option = {
//   showLines: true,
//   onClick: function(evt) {   
//     var element = point.getElementAtEvent(evt);
//     if(element.length > 0)
//     {
//       var ind = element[0]._index;
//       if(confirm('Do you want to remove this point?')){
//         data.datasets[0].data.splice(ind, 1);
//         data.labels.splice(ind, 1);
//         point.update(data);
//       }
//     }
//   }
// };
const point = document.getElementById('goalChart');

const updateGoals = () => {
  // set an object with groups as the property and an object as its value
  let req = {
    goals: {
      weightProgress:  [[232, 2], [230, 6], [231, 9], [231, 11]]
    }
  }
  // if there are changes entered in state for weight
  if (weight !== '') {
    // take the weight from state and add it to the request object
    req.goals.weight = weight;
  };
  // if there are changes entered in state for goal weight
  if (goalWeight !== '') {
    // take the goal weight from state and add it to the request object
    req.goals.goalWeight = goalWeight;
    //---- Dialogue goes here to make sure they want to set the endpoint
    // If the user answers affirmatively,
    
    // req.goals.weightProgress = [weight, 13]

    // set the weight endpoint at goalWeight
    req.goals.weightEndpoint = goalWeight
    console.log(progress)
    progress.push([weight, 13])
    console.log(progress)
    req.goals.weightProgress = progress
  };
  //.then  send a get request for the user
  // .then Take the values from the database and populate the goals section.
  // set a value to hold the necessary form for entering info into the database
  axios.patch('/user/goals', req)
  .then(() => {
    // if after the patch, the weight (& l8r goalWeight) is(are) populated in the Schema,
    // tie each value to its corresponding db state
    getUserGoals();
    setWeight('');
    setGoalWeight('');
  }).catch((err) =>
  console.error('Could not patch goals', err)
);
}
// const handleDate = (date) => {
//   setPickDate(date)
// }
/**Removing elements from a mongo array
 * Users.updateMany ({}, {$pull: weightProgress: {$in: [ [233, 05-15] ]}})
 * Almost.. Take the x and series values, turn them back into tuples and do this:
 * const req = {
 * value: [Add tuple here]
 * }
 */
const removeProgress = (e) => {
  console.log(progress)
  progress.splice(progress.indexOf(e), 1)
  console.log(progress)
  e = progress;
  const req = {
    goals: {}
  }
  req.goals.weightProgress = progress
  axios.patch('/user/goals', req).
  then(() => {
    getUserGoals()
  }).catch((err) =>
    console.error('Could not DELETE value', err)
  );
}
const handleDev = (e) => {
  // return alert(arrayfrom(pickDate).slice().join(''))
  let arr = Array.from(pickDate);
}

  return (
    <div id="dash_main">
      <h1 style={{textAlign: "center"}}>Dashboard</h1>
    <Grid container spacing={2}>
      <Grid size={5}
      // direction="column"
      alignItems="flex-end"
      justifyContent="space-between"
      >
        <Container>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DemoContainer> */}
                <DemoItem label="Date Picker">
                  {/* <StaticDatePicker defaultValue={dayjs('2025-01-12')} /> */}
                
                  <DesktopDatePicker value={pickDate} onChange={(newValue) => setPickDate(newValue)}/>
                </DemoItem>
                <Button onClick={handleDev}>value?</Button>
              {/* </DemoContainer> */}
            </LocalizationProvider>
          </Box>
        </Container>
      </Grid>
          <Grid size={7}>
          
                <div id="dash_container" style={{display: "flex", flexDirection: "column", paddingTop: "35px", justifyContent: "center"}}>
                  <div id="dash_workouts" style={{paddingRight:"20px"}}>
                    <DashboardWorkouts workouts={props.user.workouts}/>
                  </div>
                  <div id="dash_meals">
                    <DashboardMeals nutrition={props.user.nutrition}/>
                  </div>
                </div>
          </Grid>
          <Grid size={5} justifyContent="space-between" alignItems="flex">
            <FormControl size="small">
              <label htmlFor="current-weight">Weight Today:
                <TextField type="text"
                 name="current-weight"
                 value={weight}
                 variant="outlined"
                 onChange={() => setWeight(event.target.value)}
                 />
              </label>
              </FormControl>
                
              <FormControl>
              <label type="text" htmlFor="goal-weight">Weight Goal:
                <TextField type="text"
                 name="goal-weight"
                 value={goalWeight}
                 variant="outlined"
                 onChange={() => setGoalWeight(event.target.value)}
                 />
                 <Button variant="contained"
              type="submit"
               name="submit-goal"
               onClick={updateGoals}
               >Set User Info</Button>

                <Button variant="contained"
                onClick={()=>{setIsDisplay(!isDisplay)}}
                // type="button"
                //  name="display-goals"
                //  onClick={setIsDisplay(!IsDisplay)}
                 >See goal progress</Button>
                 {/* <Button onClick={setIsDisplay(!isDisplay)}>Display Progress</Button> */}
              </label>
              
            </FormControl>
          </Grid>

      {dbWeightX.length !== 0 && dbWeightSeries.length !== 0 
        ?
        <Grid size={7}>
      <LineChart 
      id="goalChart"
      // slotProps={{onClick={removeProgress}}}
      onClick={(item) => removeProgress(item)}
      tooltip={{trigger: 'item'}}
      // I think I can do new Date(`2025-${dbWeightX}`)
      // or straight up  use the data picker  and parse the info that shows
        xAxis={[{ data: dbWeightSeries }]}
        series={[

          {
            data: dbWeightX,
          },
        ]}

        width={500}
        height={300}
        />
        </Grid>
        :
        <Typography>No goal info found</Typography>
      }

      <Grid>
        <Container>
          <Box>
            {isDisplay ?
            // <Typography variant="h5">Current weight: {dbWeight}lbs</Typography>
            progress.map((tuple) => {
              return (
                <div key={(tuple[0], tuple[1])}>
                <Typography key={(tuple[0], tuple[1])} onClick ={() => removeProgress([tuple[0], tuple[1]])}>{tuple[0]} on Jan {tuple[1]}</Typography>
                <Typography variant='h7'>Click to remove</Typography>
                </div>
              )
            })
          :
          null
          }
          {dbGoalWeight ?
              <Typography variant="h5">goal: {dbGoalWeight}lbs </Typography>
            :
            null
            }
          </Box>
        </Container>
      </Grid>
      <Grid size={6}
    alignItems="flex-end"
    justifyContent="space-between"
    >

      {/* <Grid size={5}
      alignItems="flex"
      justifyContent="space-between"
      >
      </Grid> */}
      <Divider/>
    </Grid>
    </Grid>
    </div>
  );
}