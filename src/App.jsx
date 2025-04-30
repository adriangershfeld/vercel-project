import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch random trivia questions
  const fetchTrivia = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=6&type=multiple');
      const triviaWithAnswers = response.data.results.map((question) => ({
        ...question,
        showAnswer: false, // Add a field to track answer visibility
      }));
      setTrivia(triviaWithAnswers);
    } catch (error) {
      console.error('Error fetching trivia:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrivia();
  }, []);

  // Toggle the visibility of the answer
  const toggleAnswer = (index) => {
    setTrivia((prevTrivia) =>
      prevTrivia.map((question, i) =>
        i === index ? { ...question, showAnswer: !question.showAnswer } : question
      )
    );
  };

  return (
    <Container className="my-5 text-center">
      <h1 className="text-center mb-4">Trivia Time Don't Run Away!</h1>
      <Button variant="primary" className="mb-4" onClick={fetchTrivia}>
        Refresh Questions
      </Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <Row>
          {trivia.map((question, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Question #{index + 1}</Card.Title>
                  <Card.Text dangerouslySetInnerHTML={{ __html: question.question }} />
                  <Card.Subtitle className="mt-2">Category: {question.category}</Card.Subtitle>
                  <Button
                    variant="info"
                    className="mt-3"
                    onClick={() => toggleAnswer(index)}
                  >
                    {question.showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                  {question.showAnswer && (
                    <div className="mt-3">
                      <strong>Answer:</strong> {question.correct_answer}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default App;
