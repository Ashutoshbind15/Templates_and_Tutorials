"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../uilib/ui/card";
import { Button } from "../uilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../uilib/ui/dialog";
import { Label } from "../uilib/ui/label";
import { Input } from "../uilib/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

const RepoCard = ({
  repo,
  displayOnly,
  ownerCard,
  buyerCard,
  hasPurchased,
  orderCreationHandler,
  rerequestHandler,
}: any) => {
  const [description, setDescription] = useState(repo.description);
  const [cost, setCost] = useState(repo.cost);
  console.log(repo);
  console.log(description);

  useEffect(() => {
    setDescription(repo.description);
    setCost(repo.cost);
  }, [repo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{repo.title}</CardTitle>
        <CardDescription>{repo?.owner?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="text-xl font-bold">{repo.cost}</h1>
      </CardContent>

      <CardFooter>
        {ownerCard && (
          <div>
            <Button>View Stats</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Stats</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Stats</DialogTitle>
                  <DialogDescription>
                    Make changes to your repo stats here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      description
                    </Label>
                    <Input
                      id="description"
                      className="col-span-3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      cost
                    </Label>
                    <Input
                      id="cost"
                      className="col-span-3"
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={async () => {
                      console.log(description, cost);
                      const { data } = await axios.post(`/api/repo`, {
                        description,
                        cost,
                        repoId: repo.id,
                      });

                      console.log(data);
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {buyerCard &&
          (hasPurchased ? (
            <>
              <Button>View Repo</Button>
              <Button onClick={rerequestHandler}>ReRequest Link</Button>
            </>
          ) : (
            <Button onClick={() => orderCreationHandler(repo.id)}>Buy</Button>
          ))}
      </CardFooter>
    </Card>
  );
};

export default RepoCard;
